import { Test, TestingModule } from '@nestjs/testing';
import { TeamMemberController } from './team-member.controller';
import { TeamMemberService } from './team-member.service';

describe('TeamMemberController', () => {
  let controller: TeamMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamMemberController],
      providers: [TeamMemberService],
    }).compile();

    controller = module.get<TeamMemberController>(TeamMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
