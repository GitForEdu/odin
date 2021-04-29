import GroupsAverageStatsBoard from "./GroupsAverageStatsBoard"
import GroupsAverageStatsGrahps from "./GroupsAverageStatsGraphs"

const GroupCompareStats = ({ group, groupsStats, loading }) => {

  return (
    <>
      <GroupsAverageStatsBoard groupsStats={groupsStats} loading={loading}/>
      <GroupsAverageStatsGrahps group={group} groupsStats={groupsStats} loading={loading}/>
    </>
  )
}

export default GroupCompareStats