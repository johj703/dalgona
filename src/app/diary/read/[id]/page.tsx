const Read = ({ params }: { params: { id: string } }) => {
  console.log(params.id);
  return <div>Read</div>;
};
export default Read;
