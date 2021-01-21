import getAccessToken from "utils/bb_token_cache"

const getbbUserInfo = async (username) => {
  const bbToken = await getAccessToken()
  const tempUsernameDevelopment = username === "pettegre" ? "underviser1" : (username === "torestef" ? "underviser0" : username)
  const blackBoardResponse = await (await fetch(`${process.env.BB_API}/learn/api/public/v1/users?userName=${tempUsernameDevelopment}`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  })).json()
  let bbUserCourses = []
  let bbUserId = undefined
  let bbInstitutionRoleIds = undefined
  let bbSystemRoleIds = undefined
  if(blackBoardResponse.results.length === 1) {
    bbUserId = blackBoardResponse.results[0].id
    // bbInstitutionRoleIds = blackBoardResponse.results[0].institutionRoleIds
    // bbSystemRoleIds = blackBoardResponse.results[0].systemRoleIds
    // const blackBoardUserCourses = await (await fetch(`${process.env.BB_API}/learn/api/public/v1/users/${bbUserId}/courses`, {
    //   method: "GET",
    //   headers: new Headers({
    //     "Authorization" : `Bearer ${bbToken}`,
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   }),
    // })).json()

    const blackBoardCourses = await (await fetch(`${process.env.BB_API}/learn/api/public/v1//courses`, {
      method: "GET",
      headers: new Headers({
        "Authorization" : `Bearer ${bbToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    })).json()

    for (const course of blackBoardCourses.results) {
      const courseUsers = await (await fetch(`${process.env.BB_API}/learn/api/public/v1//courses/${course.id}/users`, {
        method: "GET",
        headers: new Headers({
          "Authorization" : `Bearer ${bbToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
      })).json()

      if(courseUsers.status !== 403) {
        (courseUsers.results).forEach(user => {
          if(user.userId === bbUserId) {
            bbUserCourses.push( {
              id: course.id,
              role: user.courseRoleId,
              description: course.description,
              name: course.name,
              courseId: course.courseId,
              term: "V21",
            })
          }
        })
      }
    }
  }

  return {
    bbUserId: bbUserId,
    bbUserCourses: bbUserCourses,
  }
}

export default getbbUserInfo