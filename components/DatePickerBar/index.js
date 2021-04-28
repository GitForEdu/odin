import { Button, Grid, TextField } from "@material-ui/core"
import DatePicker from "@material-ui/lab/DatePicker"


const DatePickerBar = ({ sinceTime, untilTime, setSinceTime, setUntilTime, leftComponent, rightComponent }) => {

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignContent="center"
        item
      >
        <Grid
          item
          xs={6}
          md={3}
        >
          <DatePicker
            renderInput={(props) =>
              <TextField
                {...props}
                margin="normal"
                helperText=""
              />}
            label="DatePicker"
            value={sinceTime}
            onChange={(newValue) => {
              setSinceTime(newValue)
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          md={3}
        >
          <DatePicker
            renderInput={(props) =>
              <TextField
                {...props}
                margin="normal"
                helperText=""
              />}
            label="DatePicker"
            value={untilTime}
            onChange={(newValue) => {
              setUntilTime(newValue)
            }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignContent="center"
        item
      >
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignContent="center"
          item
          xs={12}
          md={3}
        >
          {leftComponent}
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignContent="center"
          item
          xs={12}
          md={6}
        >
          <Grid
            item
            xs={3}
            md={4}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                const date = new Date()
                date.setDate(date.getDate()-1)
                setSinceTime(date)
                const dateUntil = new Date()
                setUntilTime(dateUntil)
              }}
            >
                Last day
            </Button>
          </Grid>
          <Grid
            item
            xs={3}
            md={4}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                const date = new Date()
                date.setDate(date.getDate()-7)
                setSinceTime(date)
                const dateUntil = new Date()
                setUntilTime(dateUntil)
              }}
            >
                Last week
            </Button>
          </Grid>
          <Grid
            item
            xs={3}
            md={4}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                const date = new Date()
                date.setMonth(date.getMonth()-1)
                setSinceTime(date)
                const dateUntil = new Date()
                setUntilTime(dateUntil)
              }}
            >
                Last month
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignContent="center"
          item
          xs={12}
          md={3}
        >
          {rightComponent}
        </Grid>
      </Grid>
    </>
  )
}

export default DatePickerBar