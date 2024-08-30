import Upload from "../src/domain/service/upload";

describe("Upload - Unit Test", () => {
  test("should upload water meter", async () => {
    const input = {
      image: "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      customer_code: "1",
      measure_datetime: new Date("2024-08-01 10:22:34"),
      measure_type: "WATER"
    };
    const upload = new Upload(input.image, input.customer_code, input.measure_datetime, input.measure_type as "WATER" | "GAS");
    expect(upload).toBeInstanceOf(Upload);
    expect(upload.getImage()).toBe(input.image);
    expect(upload.getCustomerCode()).toBe(input.customer_code);
    expect(upload.getMeasureDateTime()).toBe(input.measure_datetime);
    expect(upload.getMeasureType()).toBe(input.measure_type);
  })

  test("should upload gas meter", async () => {
    const input = {
      image: "data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      customer_code: "1",
      measure_datetime: new Date("2024-08-01 10:22:34"),
      measure_type: "GAS"
    };
    const upload = new Upload(input.image, input.customer_code, input.measure_datetime, input.measure_type as "WATER" | "GAS");
    expect(upload).toBeInstanceOf(Upload);
    expect(upload.getImage()).toBe(input.image);
    expect(upload.getCustomerCode()).toBe(input.customer_code);
    expect(upload.getMeasureDateTime()).toBe(input.measure_datetime);
    expect(upload.getMeasureType()).toBe(input.measure_type);
  })

  test("should throw error on invalid image", async () => {
    const input = {
      image: "data:image/abc;base64,iVBORw0KGgoAAAANSUhEUgAAAAE.........VR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      customer_code: "1",
      measure_datetime: new Date("2024-08-01 10:22:34"),
      measure_type: "WATER"
    };
    expect(
      () => new Upload(input.image, input.customer_code, input.measure_datetime, input.measure_type as "WATER" | "GAS")
    ).toThrow('Invalid image');
  })

  test("should throw error on invalid customer code", async () => {
    const input = {
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      customer_code: "",
      measure_datetime: new Date("2024-08-01 10:22:34"),
      measure_type: "WATER"
    };
    expect(
      () => new Upload(input.image, input.customer_code, input.measure_datetime, input.measure_type as "WATER" | "GAS")
    ).toThrow('Invalid customer code');
  })

  test("should throw error on invalid measure datetime", async () => {
    const input = {
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      customer_code: "1",
      measure_datetime: "2024-07-32",
      measure_type: "WATER"
    };
    expect(
      () => new Upload(input.image, input.customer_code, input.measure_datetime as any, input.measure_type as "WATER" | "GAS")
    ).toThrow('Invalid measure datetime');
  })

  test("should throw error on invalid measure type", async () => {
    const input = {
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      customer_code: "1",
      measure_datetime: new Date("2024-02-21 10:22:34"),
      measure_type: ""
    };
    expect(
      () => new Upload(input.image, input.customer_code, input.measure_datetime, input.measure_type as "WATER" | "GAS")
    ).toThrow('Invalid measure type');
  })
})