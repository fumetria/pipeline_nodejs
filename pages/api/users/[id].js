import { usersRepo } from "helpers/users-repo";

export default handler;

function handler(req, res) {
  switch (req.method) {
    //7:10  Error: Strings must use doublequote.  quotes
    case 'GET':
      return getUserById();
    //9:10  Error: Strings must use doublequote.  quotes
    case 'PUT':
      return updateUser();
    case 'DELETE':
      return deleteUser();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  function getUserById() {
    // 18:5  Error: Unexpected var, use let or const instead.  no-var
    let user = usersRepo.getById(req.query.id);
    return res.status(200).json(user);
  }

  function updateUser() {
    try {
      usersRepo.update(req.query.id, req.body);
      return res.status(200).json({});
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  function deleteUser() {
    usersRepo.delete(req.query.id);
    return res.status(200).json({});
  }
}
