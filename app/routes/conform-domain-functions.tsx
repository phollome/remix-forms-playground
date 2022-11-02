import { conform, parse, useFieldset, useForm } from "@conform-to/react";
import { formatError, validate } from "@conform-to/zod";
import type { ActionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
// import { makeDomainFunction } from "domain-functions";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Title required"),
});

// const mutation = makeDomainFunction(schema)(async (values) => {
//   console.log("mutation values", values);
//   return values;
// });

const makeValidator = (schema: any, mutation?: Promise<unknown>) => {
  return (args: any) => {
    const { formData } = args;
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

    if (submission.error.length > 0 || mutation === undefined) {
      return submission;
    }

    return mutation(args);

    // const result = validate(formData, schema);
    // console.log("validator result", result);
    // return result;
  };
};

const mutation = () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log("timeout");
      return resolve;
    }, 1000)
  );
};

export async function action(args: ActionArgs) {
  const { request } = args;

  const formData = await request.formData();
  const submission = parse(formData);

  const emptyEnvironment = {};

  const result = await makeValidator(schema, mutation)({ formData });
  console.log("server submission", submission);
  console.log("server result", result);

  return result;
}

export default function ConformDomainFunctions() {
  const state = useActionData<typeof action>();
  const form = useForm<z.infer<typeof schema>>({
    initialReport: "onBlur",
    state,
    onValidate: makeValidator(schema),
  });
  const { title } = useFieldset(form.ref, form.config);

  return (
    <>
      <h1>Conform Domain Functions</h1>
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
