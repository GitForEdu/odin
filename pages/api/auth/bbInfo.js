import getAccessToken from "utils/bb_token_cache"
import { getCoursesBB, getCourseUsersBB, getUserWithUserNameBB } from "utils/blackboard"

const getbbUserInfo = async (username) => {
  const bbToken = await getAccessToken()
  const tempUsernameDevelopment = process.env.MOCK_BB ? "underviser1" : username
  const bbUser = await getUserWithUserNameBB(tempUsernameDevelopment, bbToken)
  const bbUserCourses = []
  let bbUserId = undefined

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
        (courseUsers).forEach(user => {
          if(user.userId === bbUserId) {
            bbUserCourses.push( {
              id: course.id,
              role: user.courseRoleId,
              description: course.description,
              name: course.name,
              courseId: course.courseId,
              // TODO: Fix term
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