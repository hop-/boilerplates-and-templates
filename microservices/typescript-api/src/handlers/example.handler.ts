export type ExampleMessage = unknown;

export async function exampleHandler(message: ExampleMessage): Promise<void> {
  console.log('New mssage received on example topic:', JSON.stringify(message));
}
