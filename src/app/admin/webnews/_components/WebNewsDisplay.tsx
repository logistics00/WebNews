export function WebNewsHorizontal() {
  return <section className='horizontal'></section>
}

export function WebNewsVertical(webnews: any) {
  if (!webnews.webnews) return ''
  const wnTotal = webnews.webnews
  return (
    <>
      {wnTotal.map((wn: any) => (
        <WebNews key={wn.id} webnews={wn} />
      ))}
    </>
  )
}

/**
 * Displays a list of webnews records in a vertical layout.
 * The webnews records are passed as an object with a "webnews" property
 * which is an array of webnews records.
 *
 * The component renders a header with links to
 * - update the webnews type
 * - delete the webnews type
 * - create a new webnews record
 *
 * Below the header, the component renders a list of webnews records.
 * Each webnews record is rendered as a row with the following columns:
 * - Update: link to update the webnews record
 * - Delete: link to delete the webnews record
 * - Title: the title of the webnews record
 *
 * The title is rendered with the following format:
 * <span className='text-yellow-300 bg-red-800'>{writer}</span>&nbsp;
 * {core1}<span className='bg-red-500'>{core2}</span>{core3}<span className='bg-red-500'>{core4}</span>{core5}<span className='bg-red-500'>{core6}</span>{core7}<span className='bg-red-500'>{core8}</span>
 *
 * @param {Object} webnews - an object with a "webnews" property which is an array of webnews records
 * @returns {JSX.Element} - the rendered component
 */
function WebNews(webnews: Record<string, any>) {
  const data = webnews.webnews
  return (
    <>
      <div className='subHeader flex gap-1 mt-1'>
        <a href={`/admin/webnews/${data[0].page},${data[0].type},${data[0].column}/update-type`}>U</a>
        <a href={`/admin/webnews/${data[0].page},${data[0].type},${data[0].column}/delete-type`}>D</a>
        <a href={`/admin/webnews/${data[0].page},${data[0].type},${data[0].column}/new-record`}>
          {data[0].type} ({data.length})
        </a>
      </div>
      {data.map((webnew: Record<string, any>) => (
        <div key={webnew.id}>
          <div className='flex gap-1 text-xs'>
            <div className='my-px'>
              <div className='dropDown'>
                <a
                  className={
                    webnew.origin === 'youtube'
                      ? 'text-black bg-green-200'
                      : webnew.origin === 'paper'
                      ? 'text-green-900 bg-yellow-100'
                      : 'text-black bg-white'
                  }
                >
                  ?
                </a>
                <div className='dropDown-content'>
                  <a href={`/admin/webnews/${webnew.id}/update-record`}>Update Record</a>
                  <a href={`/admin/webnews/${webnew.id}/delete-record`}>Delete Record</a>
                  <a href={`/admin/webnews/${webnew.id}/translate-record`}>Translate Record</a>
                  <a href={`/admin/webnews/${webnew.id}/info-record`}>Info about Record</a>
                </div>
              </div>
              <a
                href={webnew.filePath}
                target='_blank'
                className={
                  webnew.origin === 'youtube'
                    ? 'text-black bg-green-300 h-4 font-bold'
                    : webnew.origin === 'paper'
                    ? 'text-blackgreen-900 bg-yellow-200 h-4 font-bold'
                    : 'text-pink-600 bg-white h-4 font-bold'
                }
              >
                {/* <span className='text-yellow-300 bg-red-800'>{webnew.writer}</span>&nbsp; */}
                {webnew.core1}
                <span className='bg-purple-700 text-yellow-200'>{' '}</span>
                <span className='bg-purple-700 text-yellow-200'>{webnew.core2}</span>
                <span className='bg-purple-700 text-yellow-200'>{' '}</span>
                {webnew.core3}
                <span className='bg-purple-700 text-yellow-200'>{' '}</span>
                <span className='bg-purple-700 text-yellow-200'>{webnew.core4}</span>
                <span className='bg-purple-700 text-yellow-200'>{' '}</span>
                {webnew.core5}
                <span className='bg-purple-700 text-yellow-200'>{' '}</span>
                <span className='bg-purple-700 text-yellow-200'>{webnew.core6}</span>
                <span className='bg-purple-700 text-yellow-200'>{' '}</span>
                {webnew.core7}
                <span className='bg-purple-700 text-yellow-200'>{' '}</span>
                <span className='bg-purple-700 text-yellow-200'>{webnew.core8}</span>
                <span className='bg-purple-700 text-yellow-200'>{' '}</span>
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

//   <div className='dropDown'>
//     <a className='dropDownBtn'>
//       Prisma<i className='fa fa-caret-down'></i>
//     </a>
//     <div className='dropDown-content'>
//       <a href='/admin/webnews/update-section'>Update Section</a>
//       <a href='/admin/webnews/delete-section'>Delete Section</a>
//       {/* <a href='/admin/prisma/list-pages-types'>ListPagesTypes</a> */}
//     </div>
//   </div>
