interface UserInfoProps {
  name: string | null;
  email: string | null;
}

const UserInfo = ({ name, email }: UserInfoProps) => {
  if (!name) return <span>-</span>;

  return (
    <div>
      <div>{name}</div>
      <div className="text-sm text-muted-foreground">
        {email}
      </div>
    </div>
  );
};

export default UserInfo;