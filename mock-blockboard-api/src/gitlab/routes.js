import { graphqlHTTP } from "express-graphql"
import { importSchema } from "graphql-import"
import { makeExecutableSchema } from "graphql-tools"
import resolvers from "./resolvers"
import * as groups from "./data/groups.json"
import * as users from "./data/users.json"
import * as courses from "./data/courses.json"
import * as projects from "./data/projects.json"


const typeDefs = importSchema("./src/gitlab/schema.graphql")
const schema = makeExecutableSchema({ typeDefs, resolvers })

const baseUrl = "/api/v4/"

function gitlabroutes(app) {
  app.get(baseUrl + "groups", (req, res) => {
    res.send([])
  })

  app.post(baseUrl + "groups", async (req, res) => {
    // const body = req.body
    res.send({ id: 2 })
  })

  app.get(baseUrl + "groups/:groupId/members", async (req, res) => {
    const groupId = req.params.groupId
    const group = groups.groups.find(group => group.id === parseInt(groupId))
    console.log("group", group, groupId)
    const members = []
    if (group) {
      const memberIds = group.members
      memberIds.forEach(member => {
        const memberInfo = users.users.find(user => user.id === member.id)
        console.log("memberInfo", memberInfo)
        if (memberInfo) {
          members.push({ ...member, ...memberInfo })
        }
      })
    }
    console.log("members", members)
    res.send(members)
  })

  app.get(baseUrl + "users", async (req, res) => {
    const username = req.query.username
    const user = users.users.find(user => user.username === username)
    res.send([user])
  })

  app.get(baseUrl + "groups/:courseId", async (req, res) => {
    const courseId = req.params.courseId
    console.log(courseId)
    if (courseId.includes("/")) {
      const group = groups.groups.find(group => group.full_path === courseId)
      res.send(group)
    }
    const course = courses.courses.find(course => course.id === courseId)
    res.send(course)
  })

  app.get(baseUrl + "groups/:courseId/subgroups", async (req, res) => {
    const courseId = req.params.courseId
    const course = courses.courses.find(course => course.id === courseId)
    const groupIds = course.groups
    const _groups = []
    groupIds.forEach(groupId => {
      const group = groups.groups.find(group => group.id === groupId.id)
      _groups.push({ ...groupId, ...group })
    })
    res.send(_groups)
  })

  app.get(baseUrl + "projects/:projectId/repository/commits", async (req, res) => {
    const projectId = req.params.projectId
    const project = projects.projects.find(project => project.id === projectId)
    const commits = project.commits
    res.send(commits)
  })

  app.get(baseUrl + "projects/:projectId/repository/branches", async (req, res) => {
    const projectId = req.params.projectId
    const project = projects.projects.find(project => project.id === projectId)
    const branches = project.branches
    res.send(branches)
  })

  app.get(baseUrl + "projects/:projectId/wikis", async (req, res) => {
    const projectId = req.params.projectId
    const project = projects.projects.find(project => project.id === projectId)
    const wikiPages = project.wikiPages
    res.send(wikiPages)
  })

  app.get(baseUrl + "projects/:projectId/repository/tree", async (req, res) => {
    const projectId = req.params.projectId
    const project = projects.projects.find(project => project.id === projectId)
    const files = project.files
    res.send(files)
  })

  app.use(
    "/api/graphql",
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    })
  )
}

export default gitlabroutes