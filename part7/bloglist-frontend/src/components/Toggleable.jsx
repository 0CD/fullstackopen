import { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const Toggleable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button
          onClick={toggleVisibility}
          variant="outline-dark"
          className="w-100 mt-2"
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          onClick={toggleVisibility}
          variant="outline-dark"
          className="w-100 mt-2"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
})

Toggleable.displayName = 'Toggleable'

Toggleable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

export default Toggleable
