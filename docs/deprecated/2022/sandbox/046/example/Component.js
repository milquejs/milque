export class Component {
  static fromSchema(name, schema) {
    const schemaString = JSON.stringify(schema);
    return {
      name,
      create() {
        // This should be replaced with just creating the actual schema.
        let obj = JSON.parse(schemaString);
        return obj;
      },
    };
  }

  static fromFactory(name, createFunc) {
    return {
      name,
      create() {
        return createFunc();
      },
    };
  }
}
