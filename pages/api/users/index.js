import { usersRepo } from "helpers/users-repo";

export default handler;

function handler(req, res) {
  switch (req.method) {
    //7:10  Error: Strings must use doublequote.  quotes
    case "GET":
      return getUsers();
    //9:10  Error: Strings must use doublequote.  quotes
    case "POST":
      return createUser();
    //13:10  Error: Strings must use doublequote.  quotes
    case "DELETE":
      return deleteAllUsers();
    //11:5  Error: Default clause should be the last clause.  default-case-last
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  function getUsers() {
    const users = usersRepo.getAll();
    return res.status(200).json(users);
  }

  function createUser() {
    try {
      usersRepo.create(req.body);
      let newUserName = req.body.name;
      return res.status(200).json({ greeting: `Hello ${newUserName}` });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  function deleteAllUsers() {
    usersRepo.deleteAllUsers();
    return res.status(200).json({ message: "All users deleted" });
  }
}
