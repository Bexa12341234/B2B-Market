import { SegmentsService } from './segments.service';
export declare class SegmentsController {
    private readonly segmentsService;
    constructor(segmentsService: SegmentsService);
    findAll(): Promise<any>;
}
