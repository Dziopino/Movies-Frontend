[35mpackage-lock.json[m[36m:[m        "react-hot-[1;31mtoast[m": "^2.6.0",
[35mpackage-lock.json[m[36m:[m    "node_modules/react-hot-[1;31mtoast[m": {
[35mpackage-lock.json[m[36m:[m      "resolved": "https://registry.npmjs.org/react-hot-[1;31mtoast[m/-/react-hot-[1;31mtoast[m-2.6.0.tgz",
[35mpackage.json[m[36m:[m    "react-hot-[1;31mtoast[m": "^2.6.0",
[35msrc/admin/AdminUsers.jsx[m[36m:[mimport [1;31mtoast[m from "react-hot-[1;31mtoast[m";
[35msrc/admin/AdminUsers.jsx[m[36m:[m                return [1;31mtoast[m.error(data.message);
[35msrc/admin/AdminUsers.jsx[m[36m:[m            [1;31mtoast[m.error("Failed to refresh user");
[35msrc/admin/AdminUsers.jsx[m[36m:[m                return [1;31mtoast[m.error(usersData.message);
[35msrc/admin/AdminUsers.jsx[m[36m:[m                return [1;31mtoast[m.error(countData.message);
[35msrc/admin/AdminUsers.jsx[m[36m:[m            [1;31mtoast[m.error("Failed to load users");
[35msrc/admin/AdminUsers.jsx[m[36m:[m                return [1;31mtoast[m.error(response.message);
[35msrc/admin/AdminUsers.jsx[m[36m:[m            [1;31mtoast[m.success(response.message);
[35msrc/admin/AdminUsers.jsx[m[36m:[m            [1;31mtoast[m.error("Something went wrong");
[35msrc/admin/AdminUsers.jsx[m[36m:[m                [1;31mtoast[m.success(data.message + ": " + data.updated);
[35msrc/components/Login.jsx[m[36m:[mimport [1;31mtoast[m from "react-hot-[1;31mtoast[m";
[35msrc/components/Login.jsx[m[36m:[m                return [1;31mtoast[m.error(data.message);
[35msrc/main.jsx[m[36m:[mimport {Toaster} from "react-hot-[1;31mtoast[m";
[35msrc/main.jsx[m[36m:[m            [1;31mtoast[mOptions={{
