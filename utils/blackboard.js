

const getCourseGroupsBB = (courseId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/courses/${courseId}/groups`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json()).then(data => {
    if(data.results) {
      return data.results.filter(group => !group.isGroupSet)
    }
    return data
  })
  return response
}

const getCourseGroupsWithGroupsetBB = (courseId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/courses/${courseId}/groups`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json()).then(data => {
    if(data.results) {
      return data.results
    }
    return data
  })
  return response
}

const getCourseUsersBB = (courseId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/courses/${courseId}/users`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json()).then(data => {
    if (data.results) {
      return data.results
    }
    return data
  })
  return response
}

const getCourseUsersExpandedBB = (courseId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/courses/${courseId}/users?expand=user`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json()).then(data => {
    if (data.results) {
      return data.results
    }
    return data
  })
  return response
}

const getCourseStudentsExpandedBB = (courseId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/courses/${courseId}/users?expand=user`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json()).then(data => {
    if (data.results) {
      return data.results.filter(user => user.courseRoleId === "Student")
    }
    return data
  })
  return response
}

const getCourseBB = (courseId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v3/courses/${courseId}`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json())
  return response
}

const getCoursesBB = (bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v3/courses`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json()).then(data => {
    if(data.results) {
      return data.results
    }
    return data
  })

  return response
}

const getUserWithUserIdBB = (userId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/users/${userId}`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json())

  return response
}

const getUserWithUserNameBB = (userName, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/users/userName:${userName}`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json())

  return response
}

const createGroupsetBB = async (courseId, bbToken) => {
  let payload = {
    "name": "studentGrupper",
    "description": "<!-- {\"bbMLEditorVersion\":1} --><div data-bbid=\"bbml-editor-id_9c6a9556-80a5-496c-b10d-af2a9ab22d45\"> <h4>Header Large</h4>  <h5>Header Medium</h5>  <h6>Header Small</h6>  <p><strong>Bold&nbsp;</strong><em>Italic&nbsp;<span style=\"text-decoration: underline;\">Italic Underline</span></em></p> <ul>   <li><span style=\"text-decoration: underline;\"><em></em></span>Bullet 1</li>  <li>Bullet 2</li> </ul> <p>  <img src=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-1217_1\">   <span>\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"</span> </p>  <p><span>&lt;braces test=\"values\" other=\"strange things\"&gt;</span></p> <p>Header Small</p> <ol>   <li>Number 1</li>   <li>Number 2</li> </ol>  <p>Just words followed by a formula</p>  <p><img align=\"middle\" alt=\"3 divided by 4 2 root of 7\" class=\"Wirisformula\" src=\"@X@EmbeddedFile.requestUrlStub@X@sessions/EA5F7FF3DF32D271D0E54AF0150D924A/anonymous/wiris/49728c9f5b4091622e2f4d183d857d35.png\" data-mathml=\"«math xmlns=¨http://www.w3.org/1998/Math/MathML¨»«mn»3«/mn»«mo»/«/mo»«mn»4«/mn»«mroot»«mn»7«/mn»«mn»2«/mn»«/mroot»«/math»\"></p> <p><a href=\"http://www.blackboard.com\">Blackboard</a></p> </div>",
    "availability": {
      "available": "Yes",
    },
    "enrollment": {
      "type": "InstructorOnly",
      "limit": 0,
      "signupSheet": {
        "name": "studentGrupper",
        "description": "<!-- {\"bbMLEditorVersion\":1} --><div data-bbid=\"bbml-editor-id_9c6a9556-80a5-496c-b10d-af2a9ab22d45\"> <h4>Header Large</h4>  <h5>Header Medium</h5>  <h6>Header Small</h6>  <p><strong>Bold&nbsp;</strong><em>Italic&nbsp;<span style=\"text-decoration: underline;\">Italic Underline</span></em></p> <ul>   <li><span style=\"text-decoration: underline;\"><em></em></span>Bullet 1</li>  <li>Bullet 2</li> </ul> <p>  <img src=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-1217_1\">   <span>\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"</span> </p>  <p><span>&lt;braces test=\"values\" other=\"strange things\"&gt;</span></p> <p>Header Small</p> <ol>   <li>Number 1</li>   <li>Number 2</li> </ol>  <p>Just words followed by a formula</p>  <p><img align=\"middle\" alt=\"3 divided by 4 2 root of 7\" class=\"Wirisformula\" src=\"@X@EmbeddedFile.requestUrlStub@X@sessions/EA5F7FF3DF32D271D0E54AF0150D924A/anonymous/wiris/49728c9f5b4091622e2f4d183d857d35.png\" data-mathml=\"«math xmlns=¨http://www.w3.org/1998/Math/MathML¨»«mn»3«/mn»«mo»/«/mo»«mn»4«/mn»«mroot»«mn»7«/mn»«mn»2«/mn»«/mroot»«/math»\"></p> <p><a href=\"http://www.blackboard.com\">Blackboard</a></p> </div>",
        "showMembers": true,
      },
    },
  }

  const response = await fetch(`${process.env.BB_API}/learn/api/public/v2/courses/${courseId}/groups/sets`, {
    method: "POST",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  }).then(r => r.json())

  return response
}

const createGroupInGroupsetBB = async (courseId, groupSetId, groupName, bbToken) => {
  let payload = {
    "name": groupName,
    "description": "<!-- {\"bbMLEditorVersion\":1} --><div data-bbid=\"bbml-editor-id_9c6a9556-80a5-496c-b10d-af2a9ab22d45\"> <h4>Header Large</h4>  <h5>Header Medium</h5>  <h6>Header Small</h6>  <p><strong>Bold&nbsp;</strong><em>Italic&nbsp;<span style=\"text-decoration: underline;\">Italic Underline</span></em></p> <ul>   <li><span style=\"text-decoration: underline;\"><em></em></span>Bullet 1</li>  <li>Bullet 2</li> </ul> <p>  <img src=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-1217_1\">   <span>\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"</span> </p>  <p><span>&lt;braces test=\"values\" other=\"strange things\"&gt;</span></p> <p>Header Small</p> <ol>   <li>Number 1</li>   <li>Number 2</li> </ol>  <p>Just words followed by a formula</p>  <p><img align=\"middle\" alt=\"3 divided by 4 2 root of 7\" class=\"Wirisformula\" src=\"@X@EmbeddedFile.requestUrlStub@X@sessions/EA5F7FF3DF32D271D0E54AF0150D924A/anonymous/wiris/49728c9f5b4091622e2f4d183d857d35.png\" data-mathml=\"«math xmlns=¨http://www.w3.org/1998/Math/MathML¨»«mn»3«/mn»«mo»/«/mo»«mn»4«/mn»«mroot»«mn»7«/mn»«mn»2«/mn»«/mroot»«/math»\"></p> <p><a href=\"http://www.blackboard.com\">Blackboard</a></p> </div>",
    "availability": {
      "available": "Yes",
    },
    "enrollment": {
      "type": "InstructorOnly",
      "limit": 0,
      "signupSheet": {
        "name": groupName,
        "description": "<!-- {\"bbMLEditorVersion\":1} --><div data-bbid=\"bbml-editor-id_9c6a9556-80a5-496c-b10d-af2a9ab22d45\"> <h4>Header Large</h4>  <h5>Header Medium</h5>  <h6>Header Small</h6>  <p><strong>Bold&nbsp;</strong><em>Italic&nbsp;<span style=\"text-decoration: underline;\">Italic Underline</span></em></p> <ul>   <li><span style=\"text-decoration: underline;\"><em></em></span>Bullet 1</li>  <li>Bullet 2</li> </ul> <p>  <img src=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-1217_1\">   <span>\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"</span> </p>  <p><span>&lt;braces test=\"values\" other=\"strange things\"&gt;</span></p> <p>Header Small</p> <ol>   <li>Number 1</li>   <li>Number 2</li> </ol>  <p>Just words followed by a formula</p>  <p><img align=\"middle\" alt=\"3 divided by 4 2 root of 7\" class=\"Wirisformula\" src=\"@X@EmbeddedFile.requestUrlStub@X@sessions/EA5F7FF3DF32D271D0E54AF0150D924A/anonymous/wiris/49728c9f5b4091622e2f4d183d857d35.png\" data-mathml=\"«math xmlns=¨http://www.w3.org/1998/Math/MathML¨»«mn»3«/mn»«mo»/«/mo»«mn»4«/mn»«mroot»«mn»7«/mn»«mn»2«/mn»«/mroot»«/math»\"></p> <p><a href=\"http://www.blackboard.com\">Blackboard</a></p> </div>",
        "showMembers": true,
      },
    },
  }

  const response = await fetch(`${process.env.BB_API}/learn/api/public/v2/courses/${courseId}/groups/sets/${groupSetId}/groups`, {
    method: "POST",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  }).then(r => r.json())

  return response
}

const addStudentToGroupBB = async (courseId, groupId, userId, bbToken) => {
  const response = await fetch(`${process.env.BB_API}/learn/api/public/v2/courses/${courseId}/groups/${groupId}/users/${userId}`, {
    method: "PUT",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/json",
    }),
  }).then(r => r.json())

  return response
}

const getCourseGroupUsersBB = (courseId, groupId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/courses/${courseId}/groups/${groupId}/users`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json()).then(data => {
    if(data.results) {
      return data.results
    }
    return data
  })
  return response
}

const deleteGroupBB = async (courseId, groupId, bbToken) => {

  const response = await fetch(`${process.env.BB_API}/learn/api/public/v2/courses/${courseId}/groups/${groupId}`, {
    method: "DELETE",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/json",
    }),
  }).then(r => r.status)

  return response
}

const deleteGroupsetBB = async (courseId, groupId, bbToken) => {

  const response = await fetch(`${process.env.BB_API}/learn/api/public/v2/courses/${courseId}/groups/sets/${groupId}`, {
    method: "DELETE",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/json",
    }),
  }).then(r => r.status)

  return response
}

export { getCourseGroupsBB, getCourseUsersBB, getCourseBB, getCoursesBB, getUserWithUserNameBB, createGroupsetBB, createGroupInGroupsetBB, addStudentToGroupBB, getUserWithUserIdBB, getCourseGroupUsersBB, deleteGroupBB, deleteGroupsetBB, getCourseUsersExpandedBB, getCourseGroupsWithGroupsetBB, getCourseStudentsExpandedBB }