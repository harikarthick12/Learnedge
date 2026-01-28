import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MaterialsService } from './materials.service';

@Controller('materials')
@UseGuards(JwtAuthGuard)
export class MaterialsController {
    constructor(private readonly materialsService: MaterialsService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body('title') title: string,
        @Request() req: any,
    ) {
        const text = await this.materialsService.extractText(file);
        return this.materialsService.create(req.user.userId, title || file.originalname, text);
    }

    @Post('raw')
    async createRaw(@Body() body: { title: string; content: string }, @Request() req: any) {
        return this.materialsService.create(req.user.userId, body.title, body.content);
    }

    @Get()
    async findAll(@Request() req: any) {
        return this.materialsService.findAll(req.user.userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req: any) {
        return this.materialsService.findOne(id, req.user.userId);
    }
}
