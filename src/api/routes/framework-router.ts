import { Router } from 'express';
import { analyzeFramework } from '../controllers/analyze-framework';

export const analyzeFrameworkRouter = Router();

analyzeFrameworkRouter.post('/', analyzeFramework);
