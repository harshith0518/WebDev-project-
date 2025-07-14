import EditProfile from "./components/EditProfile";

const baseURL = 'http://localhost:8000/';

const paths = {
  LANDINGPAGE: `/`,
  LOGIN: `/login`,
  HOME: `/`,
  REGISTER: `/register`,
  LOGOUT: `/logout`,
  PROBLEMS: `/problems`,
  PROFILE: `/profile/:id`,
  CODEIDE: `/code-ide`,
  LEADERBOARD:'/leaderboard',
  CONTESTS:'/contests',
  EDITPROFILE: 'profile/:id/edit',
  SOLUTIONS:'/solutions',
  ADDPROBLEM: '/problems/add-problem',
};

export default paths;