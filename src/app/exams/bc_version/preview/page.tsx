import React from 'react'
import ExamDetail from '../../[id]/page'
// import ExamDetail from '../[id]/page'

export default function page({ params }: any) {
    return (
        <><ExamDetail params={params} /></>
    )
}
