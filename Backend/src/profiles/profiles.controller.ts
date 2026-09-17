import { Body, Controller, Get, Param, Patch, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('profiles')
@ApiBearerAuth()
@Controller({ path: 'profiles', version: '1' })
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get your own profile (includes owner-only data)' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyProfile(@Request() req: any) {
    return this.profilesService.getMyProfile(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update your profile (skills field is Resume Module owned — not editable here)' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiResponse({ status: 400, description: 'Validation error or skills field rejected' })
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.profilesService.updateProfile(req.user.id, dto, req.body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public profile view (no email, password, or private preferences)' })
  @ApiResponse({ status: 200, description: 'Public profile retrieved' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getPublicProfile(@Param('id') id: string) {
    return this.profilesService.getPublicProfile(id);
  }
}
