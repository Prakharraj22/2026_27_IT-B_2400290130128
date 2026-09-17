import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  fullName?: string;

  @ApiPropertyOptional()
  headline?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  yearsExperience?: number;

  @ApiProperty({ type: [String] })
  skills: string[];

  @ApiProperty({ type: Object })
  preferences: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PublicProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  fullName?: string;

  @ApiPropertyOptional()
  headline?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  yearsExperience?: number;

  @ApiProperty({ type: [String] })
  skills: string[];
}
