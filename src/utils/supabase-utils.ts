export const getImageUrl = (path: string) => {
  return path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`
    : '';
};
