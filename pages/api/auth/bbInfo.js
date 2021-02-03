import getAccessToken from "utils/bb_token_cache"
import { getCoursesBB, getCourseUsersBB, getUserBB } from "utils/blackboard"

const getbbUserInfo = async (username) => {
  const bbToken = await getAccessToken()
  const tempUsernameDevelopment = username === "pettegre" ? "underviser1" : (username === "torestef" ? "underviser0" : username)
  const bbUser = await getUserBB(tempUsernameDevelopment, bbToken)
  let bbUserCourses = []
  let bbUserId = undefined
  let bbInstitutionRoleIds = undefined
  let bbSystemRoleIds = undefined

  if(bbUser.id) {
    bbUserId = bbUser.id
    // bbInstitutionRoleIds = blackBoardResponse.results[0].institutionRoleIds
    // bbSystemRoleIds = blackBoardResponse.results[0].systemRoleIds
    // const blackBoardUserCourses = await (await fetch(`${process.env.BB_API}/learn/api/public/v1/users/${bbUserId}/courses`, {
    //   method: "GET",
    //   headers: new Headers({
    //     "Authorization" : `Bearer ${bbToken}`,
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   }),
    // })).json()


    // TODO: Get course memership only works for api user (underviser0) must fix this before relase
    const blackBoardCourses = await getCoursesBB(bbToken)

    for (const course of blackBoardCourses) {
      const courseUsers = await getCourseUsersBB(course.id, bbToken)

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