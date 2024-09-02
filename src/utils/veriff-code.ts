export const veriffStatusByCode = (code: string) => {
  switch (code) {
    case '7001':
      return 'Started'
      break
    case '7002':
      return 'Submitted'
      break
    case '9001':
      return 'Approved'
      break
    case '9102':
      return 'Declined'
      break
    case '9103':
      return 'Resubmission'
      break
    case '9104':
      return 'Expired/Abandoned'
      break
    case '9121':
      return 'Review'
      break

    default:
      return '-'
      break
  }
}
