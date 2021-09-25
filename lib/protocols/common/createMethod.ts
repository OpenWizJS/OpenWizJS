function createMethod<Params>(
  method: string,
  params: Params
): WizMethodRequest<Params> {
  return {
    method,
    params,
  };
}

export default createMethod;
