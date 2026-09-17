import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarketIntelService } from './market-intel.service';
import { SkillTrendQueryDto, SalaryBenchmarkQueryDto } from './dto/market-query.dto';

@ApiTags('market-intelligence')
@ApiBearerAuth()
@Controller({ path: 'market', version: '1' })
export class MarketIntelController {
  constructor(private readonly marketIntelService: MarketIntelService) {}

  @Get('skill-trends')
  @ApiOperation({ summary: 'Get skill demand trends by time period' })
  @ApiResponse({ status: 200, description: 'Skill demand statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSkillTrends(@Query() query: SkillTrendQueryDto) {
    return this.marketIntelService.getSkillTrends(query);
  }

  @Get('salary-benchmarks')
  @ApiOperation({ summary: 'Get salary benchmarks by role and location' })
  @ApiResponse({ status: 200, description: 'Salary percentiles (p25, p50, p75)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSalaryBenchmarks(@Query() query: SalaryBenchmarkQueryDto) {
    return this.marketIntelService.getSalaryBenchmarks(query);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get market intelligence overview dashboard metrics' })
  @ApiResponse({ status: 200, description: 'Top skills, headline salaries, and volume trends' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOverview() {
    return this.marketIntelService.getOverview();
  }
}
