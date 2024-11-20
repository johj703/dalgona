const getGenderIcon = (gender: string) => {
  const userGender = gender === "남성" ? "male" : "female";
  return `/icons/${userGender}.svg`;
};
export default getGenderIcon;
