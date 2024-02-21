export const baseOnSubmitFormik = (
  e: React.FormEvent<HTMLFormElement>,
  formik: any,
  initialValues: any,
) => {
  e.preventDefault();
  Object.keys(initialValues).map(async (v) => {
    await formik.setFieldTouched(v, true);
  });
  formik.handleSubmit();
};
