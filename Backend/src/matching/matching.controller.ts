import { Controller, Get, Param, Query, Request, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MatchingService } from './matching.service';
import { MatchQueryDto } from './dto/match-query.dto';
import { JobQueryDto } from './dto/job-query.dto';
import { JobsRepository } from './jobs.repository';

@ApiTags('matching')
@ApiBearerAuth()
@Controller({ version: '1' })
export class MatchingController {
  constructor(
    private readonly matchingService: MatchingService,
    private readonly jobsRepository: JobsRepository,
  ) {}

  @Get('matches')
  @ApiOperation({ summary: 'Get personalized job matches for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Paginated job match results with scores' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMatches(@Request() req: any, @Query() query: MatchQueryDto) {
    return this.matchingService.getMatches(
      req.user.id,
      {
        location: query.location,
        remote: query.remote,
        salaryMin: query.salaryMin,
        salaryMax: query.salaryMax,
      },
      query.page || 1,
      query.limit || 20,
    );
  }

  @Get('matches/:jobId/why')
  @ApiOperation({
    summary: 'Explain why a job was matched — deterministic breakdown, no LLM calls',
  })
  @ApiResponse({ status: 200, description: 'Match breakdown with matching and missing skills' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getMatchExplanation(@Request() req: any, @Param('jobId') jobId: string) {
    return this.matchingService.getMatchExplanation(req.user.id, jobId);
  }

  @Get('jobs')
  @ApiOperation({ summary: 'Browse and search all available job postings' })
  @ApiResponse({ status: 200, description: 'Paginated job postings' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getJobs(@Query() query: JobQueryDto) {
    return this.jobsRepository.findMany(
      {
        search: query.search,
        location: query.location,
        remote: query.remote,
        salaryMin: query.salaryMin,
        salaryMax: query.salaryMax,
      },
      query.page || 1,
      query.limit || 20,
    );
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get details of a single job by ID' })
  @ApiResponse({ status: 200, description: 'Job details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getJob(@Param('id') id: string) {
    const job = await this.jobsRepository.findById(id);
    if (!job) {
      throw new NotFoundException({ code: 'JOB_NOT_FOUND', message: 'Job not found' });
    }
    return job;
  }
}
