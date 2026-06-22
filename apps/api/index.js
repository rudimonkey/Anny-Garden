import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
const app = express();
const port = process.env.PORT || 3001;
app.use(helmet());
app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});
