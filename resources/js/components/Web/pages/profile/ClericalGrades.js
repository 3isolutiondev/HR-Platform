import React from 'react'
import classname from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Add from '@material-ui/icons/Add'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import { can } from '../../permissions/can'

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () =>({
  addMarginTop: {
    'margin-top': '.75em'
  },
  addSmallMarginRight: {
    'margin-right': '.25em'
  },
  addMarginBottom: {
    'margin-bottom': '.75em'
  },
  capitalize: {
    'text-transform': 'capitalize'
  },
})

const ClericalGrades = ({ clericalGrades, officeEquipments, profileID, classes }) => (
  <Card>
    <CardContent>
      <Grid container spacing={8}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={8}><Typography variant="h6" color="primary">Clerical Grades</Typography></Grid>
        <Grid item xs={12} sm={3} md={3} lg={3} xl={2}>
          { (!profileID && can("P11 Access")) ?
            <Button variant="contained" color="primary" fullWidth><Add fontSize="small"/>  Add Clerical Grade</Button> : null
          }
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={3} xl={2}>
          { (!profileID && can("P11 Access")) ?
            <Button variant="contained" color="primary" fullWidth><Add fontSize="small"/>  Add Office Machine</Button> : null
          }
        </Grid>

        <Grid item xs={12}>
          { clericalGrades.map(clericalGrade => {
            return(
              <Grid container spacing={8} key={clericalGrade.id} className={classname(classes.addMarginBottom, classes.addMarginTop)}>
                <Grid item xs={12} sm={8} lg={10}>
                  <Typography variant="h6">{clericalGrade.language.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={2} lg={1}>
                  { (!profileID && can("P11 Access")) ?
                      <Button variant="contained" size="small" fullWidth><Edit fontSize="small" /> Edit</Button> : null
                  }
                </Grid>
                <Grid item xs={12} sm={2} lg={1}>
                  { (!profileID && can("P11 Access")) ?
                    <Button variant="contained" size="small" fullWidth><Delete fontSize="small" /> Delete</Button> : null
                  }
                </Grid>

                <Grid item xs={12} sm={5}>
                  <Typography variant="subtitle2">Typing Score (Words per minute)</Typography>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="body2">{clericalGrade.typing_score}</Typography>
                </Grid>

                <Grid item xs={12} sm={5}>
                  <Typography variant="subtitle2">Shorthand Score (Words per minute)</Typography>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Typography variant="body2">{clericalGrade.shorthand_score}</Typography>
                </Grid>

              </Grid>
            )
          })}
          { (officeEquipments &&
            Array.isArray(officeEquipments) &&
            (officeEquipments.length > 0)) ?
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="primary" className={classes.addMarginBottom}>List of any office machines or equipments You can use</Typography>
              { officeEquipments.map((equipment, index) => {
                return(
                  <Chip
                    key={index}
                    label={equipment.name}
                    // onDelete={handleDelete}
                    color="primary"
                    className={classname(classes.addSmallMarginRight, classes.capitalize)}
                  />
                )
              })}
            </Grid>
            : null
          }
        </Grid>
      </Grid>
    </CardContent>
  </Card>
)

export default withStyles(styles)(ClericalGrades)
