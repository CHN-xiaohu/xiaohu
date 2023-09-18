export const todayTime = () => {
  const myDate = new Date();
  const months =
    Number(myDate.getMonth()) + 1 >= 10
      ? Number(myDate.getMonth()) + 1
      : `0${Number(myDate.getMonth()) + 1}`;
  const days = Number(myDate.getDate()) >= 10 ? myDate.getDate() : `0${myDate.getDate()}`;
  const initTime = `${myDate.getFullYear()}-${months}-${days}`;

  return {
    start: `${initTime}`,
    end: `${initTime}`,
    // start: `${initTime} 00:00:00`,
    // end: `${initTime} 23:59:59`,
  };
};

export const stringFilterOption = (input: string, option: { props: { children: string } }) =>
  option.props.children.indexOf(input) > -1;
