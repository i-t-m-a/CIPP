import React, { useEffect, useState } from 'react'
import { CButton } from '@coreui/react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { faEdit, faEllipsisV, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { cellBooleanFormatter, CellTip } from 'src/components/tables'
import { CippPageList } from 'src/components/layout'
//import { TitleButton } from 'src/components/buttons'
import { CippActionsOffcanvas } from 'src/components/utilities'

const Offcanvas = (row, rowIndex, formatExtraData) => {
  const tenant = useSelector((state) => state.app.currentTenant)
  const [ocVisible, setOCVisible] = useState(false)
  const viewLink = `/identity/administration/users/view?userId=${row.id}&tenantDomain=${tenant.defaultDomainName}&userEmail=${row.userPrincipalName}`
  const editLink = `/identity/administration/users/edit?userId=${row.id}&tenantDomain=${tenant.defaultDomainName}`
  const msaExclude = `/identity/reports/MSAUserReport`
  //console.log(row)
  return (
    <>
      <Link to={viewLink}>
        <CButton size="sm" variant="ghost" color="success">
          <FontAwesomeIcon icon={faEye} />
        </CButton>
      </Link>
      <CButton size="sm" color="link" onClick={() => setOCVisible(true)}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </CButton>
      <CippActionsOffcanvas
        title="User Information"
        extendedInfo={[
          { label: 'Created Date (UTC)', value: `${row.createdDateTime ?? ' '}` },
          { label: 'UPN', value: `${row.userPrincipalName ?? ' '}` },
          { label: 'Given Name', value: `${row.givenName ?? ' '}` },
          { label: 'Surname', value: `${row.surname ?? ' '}` },
          { label: 'Job Title', value: `${row.jobTitle ?? ' '}` },
          { label: 'Licenses', value: `${row.LicJoined ?? ' '}` },
          { label: 'Business Phone', value: `${row.businessPhones ?? ' '}` },
          { label: 'Mobile Phone', value: `${row.mobilePhone ?? ' '}` },
          { label: 'Mail', value: `${row.mail ?? ' '}` },
          { label: 'City', value: `${row.city ?? ' '}` },
          { label: 'Department', value: `${row.department ?? ' '}` },
          { label: 'OnPrem Last Sync', value: `${row.onPremisesLastSyncDateTime ?? ' '}` },
          { label: 'Unique ID', value: `${row.id ?? ' '}` },
        ]}
        actions={[
          {
            icon: <FontAwesomeIcon icon={faEye} className="me-2" />,
            label: 'View User',
            link: viewLink,
            color: 'success',
          },
          {
            icon: <FontAwesomeIcon icon={faEdit} className="me-2" />,
            label: 'Exclude From MSA Report',
            link: msaExclude,
            color: 'danger',
            modal: true,
            modalUrl: `/api/ExcludeMSAUsers`,
            modalMessage: 'Are you sure you want to exclude the selected users?',
          },
        ]}
        placement="end"
        visible={ocVisible}
        id={row.id}
        hideFunction={() => setOCVisible(false)}
      />
    </>
  )
}

const Users = (row) => {
  const [tenantColumnSet, setTenantColumn] = useState(true)
  const columns = [
    {
      name: 'Tenant',
      selector: (row) => row['Tenant'],
      sortable: true,
      cell: (row) => CellTip(row['Tenant']),
      exportSelector: 'Tenant',
      omit: tenantColumnSet,
    },
    {
      name: 'Retrieval Status',
      selector: (row) => row['CippStatus'],
      sortable: true,
      cell: (row) => CellTip(row['CippStatus']),
      exportSelector: 'CippStatus',
      omit: tenantColumnSet,
    },
    {
      name: 'Display Name',
      selector: (row) => row['displayName'],
      sortable: true,
      cell: (row) => CellTip(row['displayName']),
      exportSelector: 'displayName',
      minWidth: '300px',
    },
    {
      name: 'Email',
      selector: (row) => row['mail'],
      sortable: true,
      cell: (row) => CellTip(row['mail']),
      exportSelector: 'mail',
      minWidth: '250px',
    },
    {
      name: 'Licenses',
      selector: (row) => row['LicJoined'],
      exportSelector: 'LicJoined',
      sortable: true,
      grow: 5,
      wrap: true,
      minWidth: '200px',
    },
    {
      name: 'id',
      selector: (row) => row['id'],
      omit: true,
    },
    {
      name: 'Actions',
      cell: Offcanvas,
    },
  ]
  const tenant = useSelector((state) => state.app.currentTenant)
  useEffect(() => {
    if (tenant.defaultDomainName === 'AllTenants') {
      setTenantColumn(false)
    }
    if (tenant.defaultDomainName !== 'AllTenants') {
      setTenantColumn(true)
    }
  }, [tenantColumnSet])

  //const titleButtons = (
  //  <div style={{ display: 'flex', alignItems: 'right' }}>
  //    <TitleButton key="add-user" href="/identity/administration/users/add" title="Add User" />
  //    <div style={{ marginLeft: '10px' }}>
  //      <TitleButton
  //        key="Invite-Guest"
  //        href="/identity/administration/users/InviteGuest"
  //        title="Invite Guest"
  //      />
  //    </div>
  //  </div>
  //)
  return (
    <CippPageList
      capabilities={{ allTenants: true, helpContext: 'https://google.com' }}
      title="Users"
      //titleButton={titleButtons}
      datatable={{
        filterlist: [
          { filterName: 'Enabled users', filter: '"accountEnabled":true' },
          { filterName: 'Disabled users', filter: '"accountEnabled":false' },
          { filterName: 'AAD users', filter: '"onPremisesSyncEnabled":false' },
          { filterName: 'Synced users', filter: '"onPremisesSyncEnabled":true' },
          { filterName: 'Guest users', filter: '"usertype":"guest"' },
          { filterName: 'Users with a license', filter: '"assignedLicenses":[{' },
          { filterName: 'Users without a license', filter: '"assignedLicenses":[]' },
          {
            filterName: 'Users with a license (Graph)',
            filter: 'assignedLicenses/$count ne 0',
            graphFilter: true,
          },
        ],
        columns,
        path: '/api/ListUsersMSA',
        reportName: `${tenant?.defaultDomainName}-Users`,
        params: { TenantFilter: tenant?.defaultDomainName },
        tableProps: {
          selectableRows: true,
          actionsList: [
            {
              label: 'Exclude From MSA Report',
              color: 'danger',
              modal: true,
              modalUrl: `/api/ExcludeMSAUsers`,
              modalMessage: 'Are you sure you want to exclude the selected users?',
            },
          ],
        },
      }}
    />
  )
}

export default Users
