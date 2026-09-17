import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SkillTrendQueryDto {
  @ApiPropertyOptional({ example: '2024-01-01', description: 'Period start date (ISO format)' })
  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @ApiPropertyOptional({ example: '2024-03-31', description: 'Period end date (ISO format)' })
  @IsOptional()
  @IsDateString()
  periodEnd?: string;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class SalaryBenchmarkQueryDto {
  @ApiPropertyOptional({ example: 'Backend Engineer' })
  @IsOptional()
  @IsString()
  roleTitle?: string;

  @ApiPropertyOptional({ example: 'global' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: '2024-Q1' })
  @IsOptional()
  @IsString()
  period?: string;
}
