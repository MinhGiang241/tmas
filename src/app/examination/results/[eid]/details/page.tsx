"use client"
import React, { useEffect, useState } from 'react'
import MBreadcrumb from '@/app/components/config/MBreadcrumb'
import HomeLayout from '@/app/layouts/HomeLayout'
import { Collapse } from 'antd'
import './style.css'
import ManyResult from './questions/ManyResult'
import TrueFalse from './questions/TrueFalse'
import Connect from './questions/Connect'
import Explain from './questions/Explain'
import Coding from './questions/Coding'

export default function Result({ params }: any) {

    return (
        <HomeLayout>
            <MBreadcrumb
                items={[
                    { text: "Danh sách đợt thi", href: "/" },
                    {
                        href: `/`,
                        text: `Kết quả đợt thi`,
                    },
                    {
                        href: `/`,
                        text: `Tên gì gì đó`,
                        active: true,
                    },
                ]}
            />
            <div className="grid grid-cols-3">
                <div className="col-span-2">
                    <Collapse
                        defaultActiveKey={["1"]}
                        // defaultActiveKey={defaultActiveKeys}
                        key={""}
                        ghost
                        expandIconPosition="end"
                        className="mb-5 rounded-lg bg-white overflow-hidden arrow"
                    >
                        <Collapse.Panel
                            key="1"
                            header={
                                <div className="my-3 flex justify-between items-center">
                                    <div>
                                        <div className="text-base font-semibold">Tên</div>
                                    </div>
                                    <div className="min-w-28  pl-5">
                                    </div>
                                </div>
                            }
                        >
                            <ManyResult />
                            <TrueFalse />
                            <Connect />
                            <Explain />
                            <Coding />
                        </Collapse.Panel>
                    </Collapse>
                </div>
                <div className="col-span-1 bg-gray-300 h-10">Cột 2</div>
            </div>
        </HomeLayout>
    )
}
