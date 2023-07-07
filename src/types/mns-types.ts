export type MNSOptions = {
  accountId: string;
  regionId: string;
  accessKeyId: string;
  accessKeySecret: string;
};

export type MNSQueueOptions = { queueName: string } & MNSOptions;
