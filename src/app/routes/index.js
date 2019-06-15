import {
    Router
} from 'express';
import userRoutes from './users';
import swaggerJson from './../../public/doc/swagger.json';
import swaggerUiExpress from  'swagger-ui-express';

const router = Router();

router.use('/api', userRoutes);
router.get('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerJson));


module.exports = router;