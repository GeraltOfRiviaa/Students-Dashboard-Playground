interface Props{
  children: string
}

function Alert({children}: Props) {
  return (
    <div className='alert alert-primary' role='alert'>{children}</div>
  )
}

export default Alert