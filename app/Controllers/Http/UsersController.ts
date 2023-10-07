import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

export default class UsersController {
  protected tableName = "users";

  public async create({ request, response }: HttpContextContract) {
    const newUserSchema = schema.create({
      username: schema.string([
        rules.unique({
          column: "username",
          table: this.tableName,
        }),
        rules.required(),
      ]),
      email: schema.string([
        rules.unique({
          column: "email",
          table: this.tableName,
        }),
        rules.required(),
      ]),
      password: schema.string([rules.required()]),
    });

    try {
      const payload = await request.validate({
        schema: newUserSchema,
      });

      const user = new User();
      user.username = payload.username;
      user.email = payload.email;
      user.password = payload.password;

      let create_user = await user.save();

      let return_body = {
        success: true,
        details: create_user,
        message: "User Successully created",
      };

      response.send(return_body);
    } catch (error) {
      console.log(error.toString());
      return response.status(500).send({
        success: false,
        message: error.messages,
      });
    }
  } //create

  public async fetch({ response }: HttpContextContract) {
    try {
      const users = await User.query();

      response.send(users);
    } catch (error) {
      return response.status(500).send({
        success: false,
        message: error.toString(),
      });
    }
  } //fetch
}
