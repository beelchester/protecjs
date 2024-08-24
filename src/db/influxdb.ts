import { InfluxDB, Point } from '@influxdata/influxdb-client'; 
import * as dotenv from 'dotenv';
dotenv.config({ path: './src/db/.env' });

const INFLUXDB_URL = process.env.INFLUXDB_URL;
const INFLUXDB_TOKEN = process.env.INFLUXDB_TOKEN;
const INFLUXDB_ORG = process.env.INFLUXDB_ORG;
const INFLUXDB_BUCKET = process.env.INFLUXDB_BUCKET;

const influxDB = new InfluxDB({
  url: INFLUXDB_URL!,
  token: INFLUXDB_TOKEN!,
});

// const writeApi = influxDB.getWriteApi(INFLUXDB_ORG!, INFLUXDB_BUCKET!, 'ns');

// Function to send demo data to InfluxDB
// const sendDemoDataToInfluxDB = async () => {
//   const demoText = "This is a sample demo text for testing InfluxDB 2.0.";

//   // Create a point with the demo text
//   const point = new Point('demo_measurement')
//     .stringField('demo_text', demoText);

//   try {
//     writeApi.writePoint(point);
//     await writeApi.flush();
//     console.log('Demo data sent to InfluxDB:', demoText);
//   } catch (error) {
//     console.error('Error sending demo data to InfluxDB:', error);
//   }
// };


// sendDemoDataToInfluxDB();
export const maliciousAttemptLogs = (attackType:string,additionalInfo:{[key:string]:any}={})=>{

    const writeApi = influxDB.getWriteApi(INFLUXDB_ORG!, INFLUXDB_BUCKET!, 'ns');
    const point = new Point('malicious_attempt')
    .tag("attackType",attackType)
    .timestamp(new Date());

    Object.keys(additionalInfo).forEach(key =>{
        point.stringField(key,additionalInfo[key]);
    });

    writeApi.writePoint(point);
    writeApi.close().catch(e=>{
        console.error("Error Closing InfluxDB write API : ",e);
    });

};

