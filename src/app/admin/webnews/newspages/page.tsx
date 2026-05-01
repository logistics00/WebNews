import db from '@/db/db'
import React from 'react'

const NewsPagesPage = async () => {
  const webnews = await db.webNews.findMany({
    // orderBy: [{ column: 'asc' }, { type: 'asc' }],
    orderBy: [{ type: 'asc' }],
    select: {
      page: true,
      type: true,
    },
  })
  const dhz = getTypesPerPage(webnews, 'DHZ')
  const dhz_hulp = getTypesPerPage(webnews, 'DHZ-Hulp')
  const dhz_machine = getTypesPerPage(webnews, 'DHZ-Machine')
  const dhz_ruimtes = getTypesPerPage(webnews, 'DHZ-Ruimtes')
  const gereedschap = getTypesPerPage(webnews, 'Gereedschap')
  const verhuizing = getTypesPerPage(webnews, 'Verhuizing')
  const hobby = getTypesPerPage(webnews, 'Hobby')
  const wielrennen = getTypesPerPage(webnews, 'Wielrennen')
  const eten_en_drinken = getTypesPerPage(webnews, 'EtenDrinken')
  const energie = getTypesPerPage(webnews, 'Energie')
  const metamorfose = getTypesPerPage(webnews, 'Metamorfose')
  const livios_dobbit_zimmo = getTypesPerPage(webnews, 'LivDobZim')
  const linux = getTypesPerPage(webnews, 'Linux')
  const javascript_react = getTypesPerPage(webnews, 'JavaScript-React')
  const nextjs = getTypesPerPage(webnews, 'NextJS')
  const software_2 = getTypesPerPage(webnews, 'Software-2')
  const software_3 = getTypesPerPage(webnews, 'Software-3')
  const software_4 = getTypesPerPage(webnews, 'Software-4')
  const deploy_hosting = getTypesPerPage(webnews, 'Deploy-Hosting')
  const divers = getTypesPerPage(webnews, 'Divers')
  const packages = getTypesPerPage(webnews, 'Packages')
  const packages_2 = getTypesPerPage(webnews, 'Packages-2')
  const databases = getTypesPerPage(webnews, 'Databases')
  const css_html_http = getTypesPerPage(webnews, 'CSS-HTML-HTTP')
  const ms = getTypesPerPage(webnews, 'MS')
  const web_db_os_github = getTypesPerPage(webnews, 'Web-DB-OS-GitHub')
  const ai = getTypesPerPage(webnews, 'AI')
  const autohotkey = getTypesPerPage(webnews, 'AutoHotkey')
  const moestuin = getTypesPerPage(webnews, 'Moestuin')
  const tuin = getTypesPerPage(webnews, 'Tuin')
  const tuin_inrichting = getTypesPerPage(webnews, 'Tuin-Inrichting')
  const AHK_Hero_Group = getTypesPerPage(webnews, 'AHK_Hero_Group')

  return (
    <div className='mt-5 mx-20 bg-blue-600 newspage'>
      <div className='mt-5 mx-10 grid grid-cols-5 grid-rows-9 grid-flow-col gap-x-6 gap-y-2'>
        <a href='/admin/webnews/DHZ/display'>
          DHZ <br /> 
          <span className='text-xs text-black'>{dhz}</span>
        </a>
        <a href='/admin/webnews/DHZ-Hulp/display'>
          DHZ-Hulp <br />
          <span className='text-xs text-black'>{dhz_hulp}</span>
        </a>
        <a href='/admin/webnews/DHZ-Machine/display'>
          DHZ-Machine <br />
          <span className='text-xs text-black'>{dhz_machine}</span>
        </a>
        <a href='/admin/webnews/DHZ-Ruimtes/display'>
          DHZ-Ruimtes <br />
          <span className='text-xs text-black'>{dhz_ruimtes}</span>
        </a>
        <a href='/admin/webnews/Gereedschap/display'>
          Gereedschap <br />
          <span className='text-xs text-black'>{gereedschap}</span>
        </a>
        <a href='/admin/webnews/Verhuizing/display'>
          Verhuizing <br />
          <span className='text-xs text-black'>{verhuizing}</span>
        </a>
        <p></p>
        <p></p>
        <p></p>
        <a href='/admin/webnews/Hobby/display'>
          Hobby <br />
          <span className='text-xs text-black'>{hobby}</span>
        </a>
        <a href='/admin/webnews/Wielrennen/display'>
          Wielrennen <br />
          <span className='text-xs text-black'>{wielrennen}</span>
        </a>
        <a href='/admin/webnews/EtenDrinken/display'>
          Eten en drinken <br />
          <span className='text-xs text-black'>{eten_en_drinken}</span>
        </a>
        <a href='/admin/webnews/Energie/display'>
          Energie <br />
          <span className='text-xs text-black'>{energie}</span>
        </a>
        <a href='/admin/webnews/Metamorfose/display'>
          Metamorfose <br />
          <span className='text-xs text-black'>{metamorfose}</span>
        </a>
        <a href='/admin/webnews/LivDobZim/display'>
          Livios-Dobbit-Zimmo <br />
          <span className='text-xs text-black'>{livios_dobbit_zimmo}</span>
        </a>
        <a href='/admin/webnews/Linux/display'>
          Linux <br />
          <span className='text-xs text-black'>{linux}</span>
        </a>
        <p></p>
        <p></p>
        <a href='/admin/webnews/JavaScript-React/display'>
          JavaScript-React <br />
          <span className='text-xs text-black'>{javascript_react}</span>
        </a>
        <a href='/admin/webnews/NextJS/display'>
          NextJS <br />
          <span className='text-xs text-black'>{nextjs}</span>
        </a>
        <a href='/admin/webnews/Software-2/display'>
          Software-2 <br />
          <span className='text-xs text-black'>{software_2}</span>
        </a>
        <a href='/admin/webnews/Software-3/display'>
          Software3 <br />
          <span className='text-xs text-black'>{software_3}</span>
        </a>
        <a href='/admin/webnews/Software-4/display'>
          Software-4 <br />
          <span className='text-xs text-black'>{software_4}</span>
        </a>
        <a href='/admin/webnews/Deploy-Hosting/display'>
          Deploy-Hosting <br />
          <span className='text-xs text-black'>{deploy_hosting}</span>
        </a>
        <a href='/admin/webnews/AutoHotkey/display'>
          AutoHotkey <br />
          <span className='text-xs text-black'>{autohotkey}</span>
        </a>
        <p></p>
        <p></p>
        <a href='/admin/webnews/Packages/display'>
          Packages <br />
          <span className='text-xs text-black'>{packages}</span>
        </a>
        <a href='/admin/webnews/Packages-2/display'>
          Packages-2 <br />
          <span className='text-xs text-black'>{packages_2}</span>
        </a>
        <a href='/admin/webnews/Databases/display'>
          Packages-2 <br />
          <span className='text-xs text-black'>{databases}</span>
        </a>
        <a href='/admin/webnews/CSS-HTML-HTTP/display'>
          CSS-HTML-HTTP <br />
          <span className='text-xs text-black'>{css_html_http}</span>
        </a>
        <a href='/admin/webnews/MS/display'>
          MS <br />
          <span className='text-xs text-black'>{ms}</span>
        </a>
        <a href='/admin/webnews/Web-DB-OS-GitHub/display'>
          Web-DB-OS-GitHub <br />
          <span className='text-xs text-black'>{web_db_os_github}</span>
        </a>
        <a href='/admin/webnews/AI/display'>
          AI <br />
          <span className='text-xs text-black'>{ai}</span>
        </a>
        <p></p>
        <p></p>
        <a href='/admin/webnews/Divers/display'>
          Divers <br />
          <span className='text-xs text-black'>{divers}</span>
        </a>
        <a href='/admin/webnews/Moestuin/display'>
          Moestuin <br />
          <span className='text-xs text-black'>{moestuin}</span>
        </a>
        <a href='/admin/webnews/Tuin/display'>
          Tuin <br />
          <span className='text-xs text-black'>{tuin}</span>
        </a>
        <a href='/admin/webnews/Tuin-Inrichting/display'>
          Tuin-Inrichting <br />
          <span className='text-xs text-black'>{tuin_inrichting}</span>
        </a>
        <a href='/admin/webnews/AHK-Hero-Group/display'>
          AHK-Hero-Group <br />
          <span className='text-xs text-black'>{AHK_Hero_Group}</span>
        </a>
      </div>
    </div>
  )
}

export default NewsPagesPage

function getTypesPerPage(webnews: any, webnewsType: string) {
  const types = webnews.filter((obj: any) => {
    return obj.page === webnewsType && obj.type
  })
  const array = Array.from(new Set(types.map((record: any) => record.type)))

  let res = ''
  for (let i = 0; i < array.length; i++) res = res + ', ' + array[i]
  return res.substring(1)
}
