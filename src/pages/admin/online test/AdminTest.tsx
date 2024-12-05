import { BreadCrumb } from "primereact/breadcrumb"
import { AdminLayout } from "../../../layouts/admin layouts/AdminLayout"
import { MenuItem } from "primereact/menuitem"
import { Link, useNavigate } from "react-router-dom"
import React, { useEffect, useRef, useState } from "react"
import { ETestStatus, TestInfoDTO } from "../../../types/type"
import * as ManageTestService from "../../../services/admin services/ManageTestService"
import { Toast } from "primereact/toast"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Skeleton } from "primereact/skeleton"
import { Tag } from "primereact/tag"
import { Button } from "primereact/button"
import { Toolbar } from "primereact/toolbar"
const AdminTest: React.FC = () => {

    const navigate = useNavigate()
    const [tests, setTests] = useState<TestInfoDTO[]>()
    const [selectedTest, setSelectedTest] = useState<TestInfoDTO | null>(null)
    const toast = useRef<Toast>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const home: MenuItem = { icon: 'pi pi-home', url: '/admin/dashboard' }
    const itemsBreadCrumb: MenuItem[] = [
        { label: 'Online Test' },
        {
            label: 'Test',
            template: () => <Link to="/admin/test" style={{ textDecoration: 'none' }} className="text-primary font-semibold">Test</Link>
        }
    ]

    useEffect(() => {
        const fetchAllTest = async () => {
            try {
                setLoading(true)
                const response = await ManageTestService.callGetAllTestInfo()
                if (response.data) {
                    setTests(response.data)
                }
            } catch (error) {
                console.log(error)
                toast.current?.show({ severity: 'error', summary: 'error', detail: 'Error while fetching tests' })
            } finally {
                setLoading(false)
            }
        }
        fetchAllTest()
    }, [])

    const getSeverity = (status: string) => {
        switch (status) {
            case ETestStatus.PUBLISHED:
                return 'success'
            case ETestStatus.INACTIVE:
                return 'warning'
            case ETestStatus.DRAFT:
                return 'contrast'
            default:
                return null
        }
    }

    const statusBodyTemplate = (test: TestInfoDTO) => {
        return <Tag value={test.status} severity={getSeverity(test.status)}></Tag>
    }

    const actionBodyTemplate = (test: TestInfoDTO) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2"  />
                <Button icon="pi pi-trash" rounded outlined severity="danger" />
            </React.Fragment>
        )
    }

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" label="New" className="mr-2" onClick={() => navigate('/admin/test/add')}/>
        </React.Fragment>
    )

    return (
        <AdminLayout tabName="Test">
            <Toast ref={toast} />
            <BreadCrumb model={itemsBreadCrumb} home={home} />
            <div className="layout-content">
                <Toolbar className="mb-4" start={startContent}/>

                <DataTable value={tests} paginator rows={8} selectionMode={'radiobutton'} selection={selectedTest!}
                    onSelectionChange={(e) => setSelectedTest(e.value)} dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="id" header="ID"></Column>
                    <Column field="testCategory" header="Category"></Column>
                    <Column field="title" header="Title" sortable></Column>
                    <Column field="totalParts" header="Total parts" sortable></Column>
                    <Column field="totalQuestions" header="Total questions" sortable></Column>
                    <Column field="status" header="Status" body={loading ? <Skeleton /> : statusBodyTemplate}></Column>
                    <Column body={loading ? <Skeleton /> : actionBodyTemplate} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
        </AdminLayout>
    )
}

export default AdminTest