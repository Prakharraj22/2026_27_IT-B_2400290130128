import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

// Shared nested item shapes for Profile.projects/experience/certifications.
// These are plain user-owned data (unlike `skills`, which the Resume
// Module owns) — validated here mainly to keep the JSONB contents
// well-formed, not to enforce any particular business rule.

export class ProjectDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ example: 'Personal Finance Tracker' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  link?: string;
}

export class ExperienceDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ example: 'Backend Engineering Intern' })
  @IsString()
  role: string;

  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'Jun 2025 - Aug 2025' })
  @IsString()
  duration: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class CertificationDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ example: 'AWS Certified Developer' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Amazon Web Services' })
  @IsString()
  issuer: string;

  @ApiProperty({ example: 2025 })
  @IsInt()
  @Min(1980)
  @Max(2100)
  year: number;
}
