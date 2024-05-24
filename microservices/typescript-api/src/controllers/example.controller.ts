/* eslint-disable class-methods-use-this */
import {
  Body,
  Controller, Get, Path, Post, Route,
} from 'tsoa';

@Route('example')
export class ExampleController extends Controller {
  @Get('{id}')
  public async getById(
    @Path() id: number,
  ) {
    return {
      id,
      exampleField: 'test',
    };
  }

  @Post()
  public async create(
    @Body() data: { exampleField: string },
  ) {
    return {
      id: Math.floor(Math.random() * 1000),
      ...data,
    };
  }
}
