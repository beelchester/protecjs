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

export const maliciousAttemptLogs = (attackType:string,additionalInfo:{[key:string]:any}={})=>{

    const writeApi = influxDB.getWriteApi(INFLUXDB_ORG!, INFLUXDB_BUCKET!, 'ns');
    const point = new Point('malicious_attempt')
    .tag("attackType",attackType)
    .timestamp(new Date());

    Object.keys(additionalInfo).forEach(key =>{
        point.stringField(key,additionalInfo[key]);
    });
    console.log("Logging malicious attempt:", { attackType, additionalInfo });

    writeApi.writePoint(point);
    writeApi.close().catch(e=>{
        console.error("Error Closing InfluxDB write API : ",e);
    });

};
