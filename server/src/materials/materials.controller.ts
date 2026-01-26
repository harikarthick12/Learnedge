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
export class MaterialsController {
    constructor(private readonly materialsService: MaterialsService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body('title') title: string,
    ) {
        const text = await this.materialsService.extractText(file);
        // Using static guest ID
        return this.materialsService.create('guest-user', title || file.originalname, text);
    }

    @Post('raw')
    async createRaw(@Body() body: { title: string; content: string }) {
        return this.materialsService.create('guest-user', body.title, body.content);
    }

    @Get()
    async findAll() {
        return this.materialsService.findAll('guest-user');
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.materialsService.findOne(id, 'guest-user');
    }
}
