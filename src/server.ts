import app from './app';
import config from './config';
import { prisma } from './lib/prisma';
import 'dotenv/config';

const PORT = config.port;

async function main() {
   try {
      await prisma.$connect();
      console.log(`Prisma is connected`);
      app.listen(PORT, () => {
         console.log(`Server is running on port ${PORT}`);
      });
   } catch (err) {
      console.log('Error starting the server', err);
      await prisma.$disconnect();
      process.exit(1);
   }
}
main();
