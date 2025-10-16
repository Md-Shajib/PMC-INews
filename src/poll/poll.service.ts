import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll } from './entities/poll.entity';
import { DataSource, Repository } from 'typeorm';
import { PollOption, PollOptionStatus } from './entities/poll-option.entity';
import { PollVote } from './entities/poll-vote.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
    @InjectRepository(PollOption)
    private readonly pollOptionRepository: Repository<PollOption>,
    @InjectRepository(PollVote)
    private readonly pollVoteRepository: Repository<PollVote>,
    private readonly dataSource: DataSource,
  ) {}

  async createPoll(createPollDto: CreatePollDto) {
    const { title, description, status, start_date, end_date, options } =
      createPollDto;
    if (!options || options.length < 2) {
      throw new BadRequestException('A poll must have at least two options');
    }
    // Use transaction to ensure both poll and options save together
    return await this.dataSource.transaction(async (manager) => {
      // Step 1: Create poll
      const poll = manager.create(Poll, {
        title,
        description,
        status,
        start_date,
        end_date,
      });

      const savedPoll = await manager.save(Poll, poll);

      // Step 2: Create options
      const pollOptions = options.map((opt) =>
        manager.create(PollOption, {
          poll_id: savedPoll.id,
          option_text: opt.option_text,
          status: PollOptionStatus.ENABLED,
        }),
      );

      await manager.save(PollOption, pollOptions);

      // Step 3: Attach options to the returned object
      savedPoll.options = pollOptions;

      return savedPoll;
    });
  }

  //Find Poll List
  async findPollList(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
  ) {
    const skip = (page - 1) * limit;
    const query = this.pollRepository
      .createQueryBuilder('poll')
      .leftJoin('poll.options', 'option')
      .leftJoin('option.votes', 'vote')
      .select([
        'poll.id',
        'poll.title',
        'poll.description',
        'poll.status',
        'poll.start_date',
        'poll.end_date',
        'poll.created_at',
      ])
      .addSelect('CAST(COUNT(DISTINCT option.id) AS INTEGER)', 'option_count')
      .addSelect('CAST(COUNT(vote.id) AS INTEGER)', 'total_votes')
      .groupBy('poll.id')
      .orderBy('poll.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      query.andWhere('poll.title ILIKE :search', { search: `%${search}%` });
    }
    if (status) {
      query.andWhere('poll.status = :status', { status });
    }

    const rawResults = await query.getRawMany();
    const data = rawResults?.map((p: any) => ({
      id: p.poll_id,
      title: p.poll_title,
      description: p.poll_description,
      status: p.poll_status,
      start_date: p.poll_start_date,
      end_date: p.poll_end_date,
      created_at: p.poll_created_at,
      option_count: Number(p.option_count),
      total_votes: Number(p.total_votes),
    }));

    return {
      data,
      pagination: {
        total: Number(rawResults.length) || 0,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(Number(rawResults.length) / limit) || 0,
      },
    };
  }

  async findOneById(id: string) {
    return await this.pollRepository.findOne({
      where: { id },
      relations: ['options'],
    });
  }

  async update(id: string, updatePollDto: UpdatePollDto) {
    const { title, description, status, start_date, end_date, options } =
      updatePollDto;

    // Step 1: Check if poll exists
    const poll = await this.pollRepository.findOne({
      where: { id },
      relations: ['options'],
    });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    // Step 2: Update poll fields
    poll.title = title ?? poll.title;
    poll.description = description ?? poll.description;
    poll.status = status ?? poll.status;
    poll.start_date = start_date ?? poll.start_date;
    poll.end_date = end_date ?? poll.end_date;

    // Step 3: Run everything in a transaction
    return await this.dataSource.transaction(async (manager) => {
      // Update poll main entity
      const updatedPoll = await manager.save(Poll, poll);

      // Step 4: Handle options (if provided)
      if (options && options.length > 0) {
        for (const opt of options) {
          // Case 1: Existing option — update it
          if (opt.id) {
            const existingOption = await manager.findOne(PollOption, {
              where: { id: opt.id, poll_id: poll.id },
            });
            if (!existingOption) {
              throw new BadRequestException(
                `Option with ID ${opt.id} not found for this poll`,
              );
            }

            existingOption.option_text =
              opt.option_text ?? existingOption.option_text;
            existingOption.status = opt.status ?? existingOption.status;
            await manager.save(PollOption, existingOption);
          }
          // Case 2: New option — add it
          else {
            const newOption = manager.create(PollOption, {
              poll_id: poll.id,
              option_text: opt.option_text,
              status: opt.status ?? PollOptionStatus.ENABLED,
            });
            await manager.save(PollOption, newOption);
          }
        }
      }
    });
  }

  async deletePoll(id: string): Promise<{ message: string }> {
    // Find the poll with options
    const poll = await this.pollRepository.findOne({
      where: { id },
      relations: ['options'],
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    // Run inside a transaction for safety
    await this.dataSource.transaction(async (manager) => {
      // Delete all votes under all options
      await manager
        .createQueryBuilder()
        .delete()
        .from(PollVote)
        .where('poll_id = :id', { id })
        .execute();

      // Delete poll options
      await manager
        .createQueryBuilder()
        .delete()
        .from(PollOption)
        .where('poll_id = :id', { id })
        .execute();

      // Finally delete the poll itself
      await manager
        .createQueryBuilder()
        .delete()
        .from(Poll)
        .where('id = :id', { id })
        .execute();
    });

    return { message: 'Poll and related data deleted successfully' };
  }

  async vote(user_id: string, option_id: string) {
    const option = await this.pollOptionRepository.findOne({
      where: { id: option_id },
      relations: ['poll'],
    });
    if (!option) {
      throw new NotFoundException('Poll option not found');
    }

    // check if option is enabled
    if (option.status !== PollOptionStatus.ENABLED) {
      throw new BadRequestException('This option is not enabled for voting');
    }

    const pollId = option.poll.id;
    
    // Check if user has already voted in this poll
    const existingVote = await this.pollVoteRepository.findOne({
      where: { poll_id: pollId, user_id },
    });
    if (existingVote) {
      throw new BadRequestException('User has already voted in this poll');
    }

    // create the vote
    const vote = this.pollVoteRepository.create({
      poll_id: pollId,
      option_id,
      user_id,
    });
    await this.pollVoteRepository.save(vote);

    // increment the vote count on the option
    option.vote_count += 1;
    await this.pollOptionRepository.save(option);

    return { message: 'Vote recorded successfully' };
  }

}
