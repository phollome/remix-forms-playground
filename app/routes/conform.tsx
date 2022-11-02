import { conform, parse, useFieldset, useForm } from "@conform-to/react";
import { formatError, validate } from "@conform-to/zod";
import type { ActionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Title required"),
});

export async function action(args: ActionArgs) {
  const { request } = args;
  const formData = await request.formData();
  const submission = parse(formData);

  try {
    switch (submission.type) {
      case "submit":
      case "validate":
        const result = schema.parse(submission.value);
        console.log("server result", result);
    }
  } catch (error) {
    console.log("server error", error);
    submission.error.push(...formatError(error));
  }

  console.log("server submission", submission);

  return submission;
}

export default function Conform() {
  const state = useActionData<typeof action>();
  const form = useForm<z.infer<typeof schema>>({
    initialReport: "onBlur",
    state,
    onValidate: (args) => {
      const { formData } = args;
      console.log("client onValidate");
      const result = validate(formData, schema);
      console.log(result);
      return result;
    },
  });
  const { title } = useFieldset(form.ref, form.config);

  return (
    <>
      <h1>Conform</h1>
      <Form method="post" {...form.props}>
        <div>
          <label htmlFor="title">Title</label>
        </div>
        <div>
          <input id="title" {...conform.input(title.config)} />
        </div>
        <div>
          <p>{title.error}</p>
        </div>
        <button type="submit">Submit</button>
      </Form>
    </>
  );
}
